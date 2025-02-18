import "../components/ComponentStyling/CompareModule.css"

const CompareModule = ({ concert1, concert2 }) => {

    return (
        <div className="CompareModule">
            <div className="Header">Compare</div>
            <div style={{ height: '300px', width: '750px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: "150px", height: '280px', margin: '10px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', color: 'white' }}>
                    <p></p>
                    <div className="rowTitle">Rating</div>
                    <div className="rowTitle">Cost</div>
                    <div className="rowTitle">Set List</div>
                    <div className="rowTitle">Quoted Vibes</div>
                    <div className="rowTitle">Distance</div>
                </div>
                <div style={{ width: "570px", height: '280px', margin: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                    <div style={{
                        width: "200px", height: '280px', margin: '10px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', color: 'white'
                    }}>
                        <div className="compareTitle">{concert1?.name || ""}</div>
                        <div className="compareItem">{concert1?.rating || ""}</div>
                        <div className="compareItem">{concert1?.price || ""}</div>
                        <div className="compareItem">Set List</div>
                        <div className="compareItem">Quoted Vibes</div>
                        <div className="compareItem">{concert1?.city || ""}</div>
                    </div>

                    <div style={{ background: 'white', width: "5px", height: '280px', margin: '10px' }}></div>

                    <div style={{
                        width: "200px", height: '280px', margin: '10px', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', alignItems: 'center', color: 'white'
                    }}>
                        <div className="compareTitle">{concert2?.name || ""}</div>
                        <div className="compareItem">{concert2?.rating || ""}</div>
                        <div className="compareItem">{concert2?.price || ""}</div>
                        <div className="compareItem">Set List</div>
                        <div className="compareItem">Quoted Vibes</div>
                        <div className="compareItem">{concert2?.city || ""}</div>
                    </div>
                </div>
            </div >

        </div >
    )


}


export default CompareModule