import { useDarkMode } from "@/hooks/useDarkMode"
import { Moon, Sun } from "lucide-react"

export function ThemeToggleButton() {
    const { isDark, toggleTheme } = useDarkMode()

    return (
        <button 
            onClick={toggleTheme}
            className="\ bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 cursor-pointer rounded-md"
        >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    )
}
