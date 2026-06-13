import { useTheme } from "../../hooks/useTheme";
import logoHorizontal from "../../assets/brand/logo-brevemente-horizontal.png";
import logoHorizontalDark from "../../assets/brand/logo-brevemente-horizontal-dark.png";
import logoHorizontalOnBlue from "../../assets/brand/logo-brevemente-horizontal-on-blue.png";
import logoVertical from "../../assets/brand/logo-brevemente-vertical.png";
import logoVerticalOnBlue from "../../assets/brand/logo-brevemente-vertical-on-blue.png";

// Variantes:
//   horizontal — logo tipográfico (BreveMente). Light = azul/negro sobre claro, dark = blanco.
//   vertical   — versión apilada con icono encima del wordmark.
//   hero       — versión vertical en grande, usada como ilustración.
const VARIANT_ASSET = {
    horizontal: {
        light: logoHorizontal,
        dark: logoHorizontalDark,
        onBlue: logoHorizontalOnBlue,
    },
    vertical: {
        light: logoVertical,
        dark: logoVerticalOnBlue,
        onBlue: logoVerticalOnBlue,
    },
    hero: {
        light: logoVertical,
        dark: logoVerticalOnBlue,
        onBlue: logoVerticalOnBlue,
    },
};

const SIZE_WIDTH = {
    sm: 140,
    md: 180,
    lg: 220,
    xl: 320,
};

export default function Logo({
    variant = "horizontal",
    size = "md",
    theme = "auto",
    alt = "BreveMente",
    className = "",
}) {
    const { theme: systemTheme } = useTheme();
    const resolvedTheme = theme === "auto" ? systemTheme : theme;
    const asset = VARIANT_ASSET[variant]?.[resolvedTheme] || logoHorizontal;
    const width = SIZE_WIDTH[size] ?? SIZE_WIDTH.md;

    return (
        <img
            src={asset}
            alt={alt}
            className={className}
            style={{ width, height: "auto" }}
            loading="lazy"
        />
    );
}
