import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type User = { id: number; name: string };

type UserMenuProps = {
  activeUser: User | null;
  setActiveUser: (user: User) => void;
  addUser: () => void;
};

const initialUsers: User[] = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

export default function UserMenu({ activeUser, setActiveUser, addUser }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold shadow"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-xl">👤</span>
        <span>{activeUser?.name || "Select User"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg z-50 p-2 flex flex-col gap-1"
          >
            {initialUsers.map((user) => (
              <button
                key={user.id}
                className={`w-full text-left px-3 py-2 rounded-lg hover:bg-blue-50 ${activeUser?.id === user.id ? "bg-blue-200 font-bold" : ""}`}
                onClick={() => {
                  setActiveUser(user);
                  setOpen(false);
                }}
              >
                {user.name}
              </button>
            ))}
            <button
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 text-green-700 font-semibold"
              onClick={() => {
                addUser();
                setOpen(false);
              }}
            >+ Add User</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 