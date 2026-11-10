import * as Location from "expo-location";
import { ROOM_RADIUS, type Coordinates } from "./rooms";
export async function locate(maxAccuracy = ROOM_RADIUS): Promise<Coordinates> {
  const permission = await Location.requestForegroundPermissionsAsync();
  if (permission.status !== "granted")
    throw Error(
      "Permita a localização precisa para confirmar sua presença na sala, inclusive ao entrar por código.",
    );
  if (!(await Location.hasServicesEnabledAsync()))
    throw Error(
      "Ative a localização precisa do aparelho para confirmar sua presença na sala.",
    );
  const position = await new Promise<Location.LocationObject>(
    (resolve, reject) => {
      const timer = setTimeout(
        () =>
          reject(
            Error(
              "A localização demorou. Ative a localização precisa e tente novamente.",
            ),
          ),
        15000,
      );
      Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
        .then(resolve, reject)
        .finally(() => clearTimeout(timer));
    },
  );
  if (
    position.coords.accuracy === null ||
    position.coords.accuracy > maxAccuracy
  )
    throw Error(
      "O GPS está impreciso para confirmar sua presença na sala. Ative a localização precisa e tente novamente.",
    );
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
    timestamp: position.timestamp,
  };
}
