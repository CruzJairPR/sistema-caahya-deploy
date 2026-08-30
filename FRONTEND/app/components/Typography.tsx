import { Typography, TypographyProps } from "@mui/material";

// Title Component
export const Title = (props: TypographyProps) => (
  <Typography
    variant="h5"
    component="h1"
    sx={{
      textAlign: "center",
      fontWeight: 700,
      color: "#dd9933",
      marginBottom: 1,
    }}
    {...props}
  />
);

// Label Component
export const Label = (props: TypographyProps) => (
  <Typography
    variant="subtitle1"
    component="label"
    sx={{
      fontWeight: 600,
      color: "#dd9933",
      display: "block",
      marginBottom: 0.5,
    }}
    {...props}
  />
);

// Error Message Component
export const ErrorMessage = (props: TypographyProps) => (
  <Typography
    variant="caption"
    component="p"
    sx={{
      color: "#eb2727",
      fontWeight: 500,
      marginTop: 0.5,
      textAlign: "center",
    }}
    {...props}
  />
);

// Subtitle Component
export const Subtitle = (props: TypographyProps) => (
  <Typography
    variant="h4"
    component="h1"
    sx={{
      fontWeight: 700,
      color: "#555",
      marginBottom: 1.5,
      ml: 2,
    }}
    {...props}
  />
);
