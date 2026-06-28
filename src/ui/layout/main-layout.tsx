"use client";
import { usePathname } from "next/navigation";
import Header from "@/ui/components/header";
import Footer from "@/ui/components/footer";
import { NotificationProvider } from "@/ui/components/notifications";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Admin pages should not use the main layout structure
  if (pathname.startsWith('/admin')) {
    return (
      <NotificationProvider position="top-right" maxNotifications={5}>
        {children}
      </NotificationProvider>
    );
  }

  // Shop pages should not use the main layout structure (no header, footer, navbar)
  if (pathname.startsWith('/shop')) {
    return (
      <NotificationProvider position="top-right" maxNotifications={5}>
        {children}
      </NotificationProvider>
    );
  }


  // Pages where navbar should not be displayed
  const pagesWithoutNavbar = ['/signin', '/register', '/switch-to-selling', '/forgot-password', '/email-verification', '/verify-email'];
  const shouldShowNavbar = !pagesWithoutNavbar.includes(pathname);

  // Pages where footer should not be displayed
  const pagesWithoutFooter = ['/seller', '/profile'];
  const shouldShowFooter = !pagesWithoutFooter.includes(pathname) && !pathname.startsWith('/seller');

  // Adjust padding based on whether navbar is shown
  const mainPadding = shouldShowNavbar ? 'pt-0' : 'pt-[68px]';

  return (
    <NotificationProvider position="top-right" maxNotifications={5}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className={`flex-grow ${mainPadding}`}>{children}</main>
        {shouldShowFooter && <Footer />}
      </div>
    </NotificationProvider>
  );
}
