import { Providers } from "../providers";

export const metadata = {
    title: "Campus-Sync",
    description: "Aravali Institute of Technical Studies — Learning Management System",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    return (
        <Providers>
            {children}
        </Providers>
    );
}
