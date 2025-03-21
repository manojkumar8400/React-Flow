import { PipelineToolbar } from "./toolbar"
// import { PipelineUI } from "./ui"
import { SubmitButton } from "./submit"
import { EnrollmentTrigger } from "./components/enrollmentTrigger/EnrollmentTrigger"
import './App.css';
import PipelineUI from "./ui";

function App() {

  return (
    <div>
      <EnrollmentTrigger />
      {/*<PipelineToolbar />*/}
      <PipelineUI />
      {/* <SubmitButton /> */}
    </div>
  )
}

export default App
