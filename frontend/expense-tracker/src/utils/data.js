import {
    LuLayoutDashboard,
    LuHandCoins,
    LuWalletMinimal,
} from 'react-icons/lu';
import { HiLogout } from 'react-icons/hi';

export const SideMenuData = [
    {
        id: "01",
        label: "Dashboard",
        icon: LuLayoutDashboard,
        path: "/dashboard",
    },
    {
        id: "02",
        label: "Income",
        icon: LuWalletMinimal,
        path: "/income",
    },
    {
        id: "03",
        label: "Expense",
        icon: LuHandCoins,
        path: "/expense",
    },
    {
        id: "06",
        label: "Logout",
        icon: HiLogout,
        path: "/logout",
    },
];
