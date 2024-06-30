import { ReactDialogBox } from 'react-js-dialog-box'

export default function privacy() {
  return (
    <div>
      <button onClick={this.openBox}>Open ReactDialogBox </button>

      {this.state.isOpen && (
        <>
          <ReactDialogBox
            closeBox={this.closeBox}
            modalWidth="60%"
            headerBackgroundColor="red"
            headerTextColor="white"
            headerHeight="65"
            closeButtonColor="white"
            bodyBackgroundColor="white"
            bodyTextColor="black"
            bodyHeight="200px"
            headerText="Title"
          >
            <div>
              <h1>Dialog Content</h1>
            </div>
          </ReactDialogBox>
        </>
      )}
    </div>
  )
}
