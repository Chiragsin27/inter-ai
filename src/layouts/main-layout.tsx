import { Container } from "@/components/container"
import { Footer } from "@/components/footer"
import Header from "@/components/header"
import AuthHandler from "@/handlers/auth-handler"
import { Outlet } from "react-router-dom"

export const MainLayout = () => {
    return(
        <div className="flex flex-col h-screen">
            <AuthHandler />
            <Header/>

            <Container className="flex-grow">
                <main className="flex-grow">
                    <Outlet />
                </main>
            </Container>

            <Footer />
        </div>
    )
}