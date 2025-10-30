import * as React from 'react';
import Button from '@mui/material/Button';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom'; 



export default function DisableElevation() {
    const navigate = useNavigate(); // initialize hook

  const handleClick = () => {
    navigate("/batch-report"); // change path as needed
  }

  return (
    <div className="flex justify-center items-center">
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.8, duration: 0.6, type: "spring", stiffness: 120 }}
        className="px-1 py-1 z-100 rounded-2xl text-lg font-semibold bg-blue-500 text-white hover:bg-blue-700 transition duration-100"
      >
     <Button variant="" disableElevation onClick={handleClick}>
      Try Code Glance
     </Button>
      </motion.button>
    </div>
 
  );
}

