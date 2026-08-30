"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ListItemButton, ListItemText, Collapse, List } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";
import { saveToHistory } from "../utils/history";
import { NavItem } from "../menuConfig";

interface MobileNavItemProps {
  item: NavItem;
  onCloseDrawer: () => void;
}

export const MobileNavItem = ({
  item,
  onCloseDrawer,
}: MobileNavItemProps) => {
  const router = useRouter();
  const [openCollapse, setOpenCollapse] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleClick = () => {
    if (hasSubmenu) {
      setOpenCollapse(!openCollapse);
    } else if (item.path) {
      saveToHistory(item.label, item.path);
      router.push(item.path);
      onCloseDrawer();
    }
  };

  return (
    <>
      <ListItemButton
        onClick={handleClick}
        sx={{ pl: 2 }}
        aria-expanded={hasSubmenu ? openCollapse : undefined}
      >
        <ListItemText primary={item.label} />
        {hasSubmenu ? openCollapse ? <ExpandLess /> : <ExpandMoreIcon /> : null}
      </ListItemButton>
      {hasSubmenu && (
        <Collapse in={openCollapse} timeout="auto" unmountOnExit>
          <List
            component="div"
            disablePadding
            sx={{ bgcolor: "rgba(255, 255, 255, 0.05)" }}
          >
            {item.submenu!.map((subItem) => (
              <MobileNavItem
                key={subItem.label}
                item={subItem}
                onCloseDrawer={onCloseDrawer}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};
