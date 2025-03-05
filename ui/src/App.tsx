import {BrowserRouter, Route, Routes} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home/HomePage.tsx";
import About from "./pages/About/About.tsx";
import ChatPage from "./pages/Chat/ChatPage.tsx";
import RecipesPage from "./pages/Recipes/RecipesPage.tsx";
import LoginPage from "./pages/Login/LoginPage.tsx";
import './services/Interceptor.ts';


// Define routes in an object format
const routes = [
    {path: '/', element: <Home/>},
    {path: '/about', element: <About/>},
    {path: '/login', element: <LoginPage/>},
    {path: '/recipes', element: <RecipesPage/>},
    {path: '/chat', element: <ChatPage/>}
];

const App = () => {
    return (
        <BrowserRouter>
            <MainLayout>
                <Routes>
                    {routes.map(({path, element}) => (
                        <Route key={path} path={path} element={element}/>
                    ))}
                </Routes>
            </MainLayout>
        </BrowserRouter>
    );
};

export default App;
