import { vi, expect, test } from 'vitest';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import BattleScreen from './BattleScreen';

test("Screen is rendered", () => {
    render(
        <BrowserRouter>
            <BattleScreen/>
        </BrowserRouter>
    );

    expect(
        screen.getByText(/Student/i)
    ).toBeInTheDocument()
    
});

// test("Can pick attack option", () => {
//     vi.useFakeTimers();

//     render(
//         <MemoryRouter
//             initialEntries={[
//                 {
//                     pathname:"/battlescreen",
//                     state: {
//                         topic: "biology",
//                         difficulty: 1
//                     }
//                 }
//             ]}>
//             <Routes>
//                 <Route path="/battlescreen" element={<BattleScreen/>}/>
//             </Routes>
//         </MemoryRouter>
        
//     );

//     vi.advanceTimersByTime(3000);

//     fireEvent(
//         screen.getByText(/attack/i),
//         new MouseEvent('click', {
//             bubbles:true
//         })
//     );

//     expect(
//         screen.getByText(/A\./i)
//     ).toBeInTheDocument();
// });