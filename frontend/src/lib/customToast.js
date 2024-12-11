import { toast } from "react-hot-toast";
export const customToast = (message, iconName) => {
    switch (iconName) {
        case 'success':
            toast(`${message}`, {
                icon: '✔',
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            break;
        case 'error':
            toast(`${message}`, {
                icon: '❌',
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            break;
        case 'warning':
            toast(`${message}`, {
                icon: '⚠',
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            break;
        case 'info':
            toast(`${message}`, {
                icon: 'ℹ️',
                style: {
                    borderRadius: "10px",
                    background: "#333",
                    color: "#fff",
                },
            });
            break;
        default:
            throw new Error('Invalid toast type');
    }
}