"use client";

import { motion } from "framer-motion";

interface StatusToggleProps {
    defaultStatus: boolean;
    onChange: (value: boolean) => void;
};

function StatusToggle({ defaultStatus, onChange }: StatusToggleProps) {
    return (
        <div
            onClick={() => onChange(!defaultStatus)}
            className={`w-12 h-6 flex items-center rounded-full cursor-pointer transition 
                ${defaultStatus ? "bg-green-600" : "bg-gray-400"}
            `}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow ml-1"
                animate={{
                    x: defaultStatus ? 24 : 0,
                }}
            />
        </div>
    );
}

export default StatusToggle;