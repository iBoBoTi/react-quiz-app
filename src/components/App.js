import { useEffect, useReducer } from 'react';
import Header from './Header.js'
import Main from './Main.js'
import Loader from './Loader.js'
import Error from './Error.js'
import StartScreen from './StartScreen.js';
import Question from './Question.js'
import NextButton from './NextButton.js'
import Progress from './Progress.js';
import FinishScreen from './FinishScreen.js';

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecieved':
      return {
        ...state, questions: action.payload, status: 'ready'
      }
    case 'dataFailed':
      return {
        ...state, status:'error'
      }
    case 'start':
        return {
          ...state, status:'active'
        }
    case 'newAnswer':
        const question = state.questions.at(state.index)
        return {
          ...state,
          answer: action.payload,
          points: action.payload === question.correctOption ? state.points + question.points : state.points
        }
    case 'nextQuestion':
        return {
          ...state,
          index: state.index + 1,
          answer: null
        }
    case 'finish':
      return {
        ...state,
        status: "finished",
        highscore: state.points > state.highscore ? state.points : state.highscore 
      }
      case 'restart':
        return {
          ...initialState,
          questions: state.questions,
          stattus: 'ready',
        }
    default:
      throw new Error("Unknown Action")
  }
}

const initialState = {
  questions: [],
  status: 'loading', // 'loading', 'error', 'ready', 'active', 'finished'
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
}

function App() {

  const [state, dispatch] = useReducer(reducer, initialState) 
  const { questions, status, index, answer, points, highscore } = state
  const numQuestions = questions.length
  const maxPoints =  questions.reduce((prev, curr)=> prev + curr.points,0)
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({type:"dataRecieved", payload: data}))
      .catch((err) => dispatch({type:"dataFailed"}))
  },[])
  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && <StartScreen numOfQuestions={numQuestions}  dispatch={dispatch}/>}
        {status === 'active' &&
          <>
          <Progress index={index} numQuestions={numQuestions} points={ points } maxPoints={maxPoints} answer={answer}/>
          <Question question={questions[index]} dispatch={dispatch} answer={answer} />
          {answer !== null && <NextButton dispatch={dispatch} numOfQuestions={ numQuestions } index={index} />}
          
          </>
        }
        {status === 'finished' && <FinishScreen points={points} maxPoints={maxPoints} dispatch={dispatch} highscore={ highscore } />}
      </Main>
    </div>
  );
}

export default App;
