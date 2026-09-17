export const formatDate = (date) => {
    if (!date) return "No disponible";
    return new Date(date).toLocaleString("es-CO");
};
