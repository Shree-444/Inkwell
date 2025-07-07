import { Avatar, AvatarFallback } from "@radix-ui/react-avatar"
import { User } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"


export function Dropdown(){
    
    const [open, setOpen] = useState(false)
    const Navigate = useNavigate()
    const authorId = localStorage.getItem('authorId')
    const dropdownRef = useRef<HTMLDivElement>(null)

    //closing dropdown on clicking outside element
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
        if (
            dropdownRef.current &&
            !dropdownRef.current.contains(event.target as Node)
        ) {
            setOpen(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return(
        <div ref={dropdownRef} className="relative inline-block">
            <button id="dropdownDefaultButton"
                    data-dropdown-toggle="dropdown" 
                    type="button"
                    className="cursor-pointer hover:bg-gray-300 rounded-full bg-gray-200"
                    onClick={() => {
                            setOpen(!open)
                        }}>
                        <div className="h-9 w-9 rounded-full flex justify-center">
                            <Avatar className="h-8 w-4 pt-1">
                                <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                                    <User className="h-7 w-4"/>
                                </AvatarFallback>
                            </Avatar>
                        </div>
                </button>

                {open && (
                    <div id="dropdown" className="absolute right-0 z-10 mt-2 overflow-hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-40 dark:bg-gray-700">
                        <div className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                            <button onClick={() => {
                                Navigate(`/profile/${authorId}`)
                            }}>
                                <div className="w-45 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Profile</div>
                            </button>
                            <button onClick={() => {
                                localStorage.clear()
                                toast.success('Log out successful')
                                Navigate('/')
                            }}>
                                <div className="w-45 px-4 py-2 text-left cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Logout</div>
                            </button>
                        </div>
                </div>
                )}
        </div>

    )
}