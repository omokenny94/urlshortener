import AppRoutes from "./routes";
import './App.css'
// import { Show, SignInButton, SignUpButton, UserButton } from '@clerk/react';
// import Home from "./pages/Home";


function App() {
  return <AppRoutes />;
}

export default App

// export default function App() {
//   return (
//     <>
//     <header>
//       <Show when="signed-out">
//         <SignInButton />
//         <SignUpButton />
//       </Show>
//       <Show when="signed-in">
//         <UserButton />
//       </Show>
//     </header>

//     <Home />
//     </>
//   );
// }