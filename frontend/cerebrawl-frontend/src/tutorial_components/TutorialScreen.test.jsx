import { expect, test } from 'vitest';
import TutorialScreen from './TutorialScreen';
import { BrowserRouter } from 'react-router-dom';
import {  render, fireEvent, screen } from "@testing-library/react";
import '@testing-library/jest-dom';


test("Screen is rendered", () => {
    render(
        <BrowserRouter>
            <TutorialScreen/>
        </BrowserRouter>
    );

    expect(
        screen.getByText(/click/i)
    ).toBeInTheDocument()
    
});

test("Can advance in tutorial", () => {
    render(
        <BrowserRouter>
            <TutorialScreen/>
        </BrowserRouter>
    );

    fireEvent(
        screen.getByText(/click/i),
        new MouseEvent('click', {
            bubbles:true
        })
    )

    expect(
        screen.getByText(/Welcome/i)
    ).toBeInTheDocument()
})



/*

  const doTutorial = (_tutorialState) => {
    switch(_tutorialState) {
      case 0:
        break;
      case 1:
        setTutText("Welcome to the Tutorial! I am your (insert cat pun) friend Purrwin. " +
          "Please click the speech bubble to continue.");
        setImg(elgato2)
        break;
      case 2:
        setTutText("First things first, this is your battle interface. It is where you will battle " +
          "some science themed enemies by answering the study questions presented to you. Click to continue.");
        setImg(elgato1)
        break;
      case 3:
        setTutText("When it's your turn, you have two choices to make. Let's start by clicking the "+
          "'Attack' button.");
        setOverlayHeight("70vh")
        break;
      case 4:
        setTutText("Now that you clicked 'Attack,' you'll see more boxes appear that have answers " +
          "to the question presented to you. If you choose the correct answer, you'll do damage to the enemy! " +
          "Click an answer, even if you don't know it, and you'll get to see what happens.");
        break;
      case 5:
        setTutText("Nice! Notice that our Professor here has 10 less HP than when we started. " +
          "Keep in mind, you'll take damage if you get it wrong. Now, click 'Next Question' to continue.");
        break;
      case -5:
        setTutText("Ouch! Notice that you took some damage, you have 10 less HP than when we started. " +
          "You'll get em next time, and you'll deal damage to your opponent if you get it right. Now, click 'Next Question' to continue.");
        break;
      case 6:
        setTutText("Let's try clicking 'Item,' this time, you should see more boxes appear with " +
          "some very yummy looking blue items to use. Some of these will heal you or do extra " +
          "damage to your enemy. After you use an Item, you will still be able to make your attack.");
        setImg(elgato1)
        break;
      case 7:
        setTutText("Try clicking an item, any item!")
        break;
      case 8:
        setTutText("Yummy! After using an item, you'll still be able to make an attack. Now you should have all the information you need to play this game! Get out there " + 
          "and have fun and learn something while doing it! Click the speech bubble to go back to the main menu");
          setOverlayHeight("100vh")
        setImg(elgato2)
        break;
      default:
        navigate("/prebattle");
        break;

    }
  }

*/