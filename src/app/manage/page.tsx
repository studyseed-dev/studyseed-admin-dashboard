import { Box, Stack } from "@mui/material";

export default function Home() {
  return (
    <Stack
      component="main"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        gap: 3,
      }}
    >
      <Box sx={{ textAlign: "center", mt: -6 }}>
        <h1>User Management</h1>
        <p className="mb-2">Easily add new users to the system or browse existing user accounts.</p>
      </Box>
    </Stack>
  );
}
