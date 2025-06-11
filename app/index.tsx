import { StyleSheet, View } from "react-native";
import {
  Canvas,
  Skia,
  SkImage,
  Image,
  useTypeface,
  SkTypeface,
  useImage,
  TileMode,
  BlendMode,
} from "@shopify/react-native-skia";
import { useEffect, useState } from "react";

const ASPECT_RATIO = 9 / 16;
const MAX_THUMBNAIL_HEIGHT = 450;

const drawCanvas = (typeface: SkTypeface, characterImage: SkImage) => {
  const titleFont = Skia.Font(typeface, 180);
  const nameFont = Skia.Font(typeface, 150);
  const statsFont = Skia.Font(typeface, 100);
  const surface = Skia.Surface.MakeOffscreen(1080, 1920);
  const canvas = surface?.getCanvas();

  const purpleColor = Skia.Color("#5f1691");
  const navyColor = Skia.Color("#2e385e");
  const lightblueColor = Skia.Color("#63cba3");
  const yellowColor = Skia.Color("#eadc7d");
  const energyBlueColor = Skia.Color("#00eeca");
  const whiteColor = Skia.Color("#FFFFFF");

  const shader = Skia.Shader.MakeLinearGradient(
    { x: 0, y: 0 },
    { x: 0, y: 1920 },
    [purpleColor, navyColor],
    null,
    TileMode.Decal,
  );
  const backgroundPaint = Skia.Paint();
  backgroundPaint.setShader(shader);

  canvas?.drawRRect(
    {
      rect: {
        x: 0,
        y: 0,
        width: 1080,
        height: 1920,
      },
      topLeft: { x: 100, y: 100 },
      topRight: { x: 100, y: 100 },
      bottomLeft: { x: 100, y: 100 },
      bottomRight: { x: 100, y: 100 },
    },
    backgroundPaint,
  );

  const radialShader = Skia.Shader.MakeRadialGradient(
    { x: 540, y: 600 },
    500,
    [energyBlueColor, yellowColor],
    null,
    TileMode.Clamp,
  );

  const turbulenceShader = Skia.Shader.MakeTurbulence(
    0.01,
    0.01,
    4,
    0,
    256,
    256,
  );

  const combinedShader = Skia.Shader.MakeBlend(
    BlendMode.Multiply,
    turbulenceShader,
    radialShader,
  );

  const characterBoxPaint = Skia.Paint();
  characterBoxPaint.setShader(combinedShader);

  canvas?.drawRRect(
    {
      rect: {
        x: 90,
        y: 300,
        width: 900,
        height: 600,
      },
      topLeft: { x: 50, y: 50 },
      topRight: { x: 50, y: 50 },
      bottomLeft: { x: 50, y: 50 },
      bottomRight: { x: 50, y: 50 },
    },
    characterBoxPaint,
  );

  canvas?.drawImage(characterImage, 260, 300);

  const titlePaint = Skia.Paint();
  const statsPaint = Skia.Paint();
  titlePaint.setColor(lightblueColor);
  statsPaint.setColor(whiteColor);

  canvas?.drawText("Gotcha!", 300, 200, titlePaint, titleFont);
  canvas?.drawText("Carroten", 120, 1100, statsPaint, nameFont);
  canvas?.drawText("Root Shockwave", 120, 1350, statsPaint, statsFont);
  canvas?.drawText("Beta Beam", 120, 1530, statsPaint, statsFont);

  canvas?.drawCircle(930, 1325, 30, statsPaint);
  canvas?.drawCircle(930, 1510, 30, statsPaint);
  canvas?.drawCircle(830, 1510, 30, statsPaint);
  canvas?.drawCircle(730, 1510, 30, statsPaint);

  surface?.flush();
  const snapshot = surface?.makeImageSnapshot();
  return snapshot?.makeNonTextureImage();
};

const getDimensions = () => {
  return {
    height: MAX_THUMBNAIL_HEIGHT,
    width: MAX_THUMBNAIL_HEIGHT * ASPECT_RATIO,
  };
};

export default function Index() {
  const pixelifyFont = useTypeface(
    require("../assets/fonts/Jersey10-Regular.ttf"),
  );
  const carrotImage = useImage(require("../assets/images/carrot.png"));
  const [image, setImage] = useState<SkImage | null>(null);

  const dimensions = getDimensions();

  useEffect(() => {
    if (pixelifyFont && carrotImage) {
      const img = drawCanvas(pixelifyFont, carrotImage);
      if (img) {
        setImage(img);
      }
    }
  }, [pixelifyFont, carrotImage]);

  return (
    <View style={styles.container}>
      <Canvas
        style={{
          width: dimensions.width,
          height: dimensions.height,
        }}
      >
        {image && (
          <Image
            image={image}
            width={dimensions.width}
            height={dimensions.height}
            x={0}
            y={0}
          />
        )}
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
