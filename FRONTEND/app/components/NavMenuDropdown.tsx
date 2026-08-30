"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Menu, MenuItem, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { saveToHistory } from "../utils/history";
import { NavItem } from "../menuConfig";

interface NavMenuDropdownProps {
  item: NavItem;
  isSubmenu?: boolean;
  onCloseParent: () => void;
}

export const NavMenuDropdown = ({
  item,
  isSubmenu = false,
  onCloseParent,
}: NavMenuDropdownProps) => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleItemClick = (label: string, path?: string) => {
    if (path) {
      saveToHistory(label, path);
      router.push(path);
      handleClose();
      onCloseParent();
    }
  };

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  if (isSubmenu) {
    return (
      <Box onMouseLeave={handleClose} sx={{ position: "relative" }}>
        <MenuItem
          onClick={(e) =>
            hasSubmenu ? handleOpen(e) : handleItemClick(item.label, item.path)
          }
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            minWidth: 180,
          }}
        >
          {item.label}
          {hasSubmenu && <ChevronRightIcon fontSize="small" />}
        </MenuItem>

        {hasSubmenu && (
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            sx={{
              "& .MuiPaper-root": {
                backgroundColor: "#002d80",
                color: "#FFFFFF",
                minWidth: 200,
              },
            }}
          >
            {item.submenu!.map((subItem) => (
              <NavMenuDropdown
                key={subItem.label}
                item={subItem}
                isSubmenu
                onCloseParent={onCloseParent}
              />
            ))}
          </Menu>
        )}
      </Box>
    );
  }

  return (
    <Box onMouseLeave={handleClose}>
      <Button
        color="inherit"
        endIcon={hasSubmenu ? <ExpandMoreIcon /> : null}
        onClick={(e) =>
          hasSubmenu ? handleOpen(e) : handleItemClick(item.label, item.path)
        }
        sx={{ textTransform: "none", color: "#FFFFFF" }}
      >
        {item.label}
      </Button>

      {hasSubmenu && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "#003DA5",
              color: "#FFFFFF",
              minWidth: 220,
            },
          }}
        >
          {item.submenu!.map((subItem) => (
            <NavMenuDropdown
              key={subItem.label}
              item={subItem}
              isSubmenu
              onCloseParent={handleClose}
            />
          ))}
        </Menu>
      )}
    </Box>
  );
};
