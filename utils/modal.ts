
export const handleRowClick = (invoice: any, setIsOpen: (isOpen: boolean) => void, setSelectedInvoice: (invoice: any) => void) => {
    setIsOpen(true);
    setSelectedInvoice(invoice);
  };