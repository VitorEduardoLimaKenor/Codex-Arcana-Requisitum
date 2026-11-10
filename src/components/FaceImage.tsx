import { useState } from "react";
import { Image, StyleSheet, View, type ImageSourcePropType } from "react-native";

/**
 * Retrato que preenche o contêiner alinhado pelo topo, onde ficam os rostos.
 * O `cover` padrão centraliza a imagem e, em faixas largas e baixas, mostra o
 * peito em vez do rosto. O contêiner precisa ter altura definida e
 * `overflow: "hidden"`.
 */
export function FaceImage({
  source,
  offset = 0.05,
  accessibilityLabel,
}: {
  source: ImageSourcePropType;
  /** Quanto do topo da imagem esconder, em fração da largura. */
  offset?: number;
  accessibilityLabel?: string;
}) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  // O retrato é quadrado: ocupa toda a largura e cobre a altura que faltar.
  const size = Math.max(box.width, box.height + box.width * offset);
  return (
    <View
      style={StyleSheet.absoluteFill}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        if (width !== box.width || height !== box.height) setBox({ width, height });
      }}
    >
      {box.width > 0 && (
        <Image
          source={source}
          accessibilityLabel={accessibilityLabel}
          aria-hidden={!accessibilityLabel}
          resizeMode="cover"
          style={{
            position: "absolute",
            left: (box.width - size) / 2,
            top: -box.width * offset,
            width: size,
            height: size,
          }}
        />
      )}
    </View>
  );
}
