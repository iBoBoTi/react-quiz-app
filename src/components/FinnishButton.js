export default function FinishButton({dispatch}) {
    return (
        <button className="btn btn-ui" onClick={()=>dispatch({type: 'finished'})}>Finish</button>
        
    )
}