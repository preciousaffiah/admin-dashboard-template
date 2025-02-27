export const handleMediaUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  field: any
) : string => {
  const file = e.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string; // Get the base64 string
      field.onChange(base64); // Update the form state with the base64 string
    };
    reader.readAsDataURL(file); // Convert the file to base64
    return reader.result as string;
  }
  return "";
};
