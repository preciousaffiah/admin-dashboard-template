declare module '@paystack/inline-js' {
    class Paystack {
      resumeTransaction(arg0: string) {
        throw new Error("Method not implemented.");
      }
      constructor(publicKey: string);
      newTransaction(params: {
        key: string;
        email: string;
        amount: number;
        ref?: string;
        metadata?: Record<string, any>;
        currency?: string;
        plan?: string;
        quantity?: number;
        subaccount?: string;
        transaction_charge?: number;
        bearer?: string;
        channels?: string[];
        onSuccess?: (response: any) => void;
        onClose?: () => void;
      }): void;
    }
  
    export = Paystack;
  }