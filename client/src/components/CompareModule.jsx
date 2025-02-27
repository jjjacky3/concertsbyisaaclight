import { FlipHorizontal } from "lucide-react";
import { parse } from "flatted";


const CompareModule = ({ concert1, concert2, onDropConcert }) => {

    const handleDragOver = (e) => {
        e.preventDefault(); // Required to allow dropping
    };

    const handleDrop = (e, side) => {
        e.preventDefault();
        const concertData = parse(e.dataTransfer.getData("concertData"));
        onDropConcert(concertData, side);
    };






    return (
        <div className="w-[700px] h-[330px] bg-gray-700/70 text-white rounded-3xl shadow-2xl p-6 transition-transform transform hover:scale-[1.02] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] flex flex-col items-center">

            {/* Title - Now Matches the Ratings Module */}
            <div className="flex items-center justify-center text-3xl font-bold pb-4 gap-2">
                <FlipHorizontal className="w-7 h-7 text-yellow-500 relative top-[1px]" />
                <span className="leading-none">Compare</span>
            </div>




            {/* Comparison Grid - Properly Aligned */}
            <div className="w-full h-[250px] flex items-center justify-center">

                {/* Row Titles - Now Aligned Correctly */}
                <div className="w-[130px] flex flex-col justify-between text-lg font-semibold italic space-y-[22px] text-right">
                    <div>Rating</div>
                    <div>Cost</div>
                    <div>Set List</div>
                    <div>Quoted Vibes</div>
                    <div>Distance</div>
                </div>

                {/* Comparison Section */}
                <div className="w-[500px] h-full flex items-center justify-center">

                    {/* Left Concert */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, "left")}
                        className="w-[180px] flex flex-col justify-between items-center space-y-[16px]">
                        <div className="text-lg font-bold">{concert1?.name || "-"}</div>
                        <div className="compareItem">{concert1?.rating || "-"}</div>
                        <div className="compareItem">${concert1?.price || "-"}</div>
                        <div className="compareItem">Set List</div>
                        <div className="compareItem">Quoted Vibes</div>
                        <div className="compareItem">{concert1?.city || "-"}</div>
                    </div>

                    {/* Divider - Thinner for Aesthetic Balance */}
                    <div className="border-l border-white h-[220px] mx-3"></div>

                    {/* Right Concert */}
                    <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, "right")}
                        className="w-[180px] flex flex-col justify-between items-center space-y-[16px]">
                        <div className="text-lg font-bold">{concert2?.name || "-"}</div>
                        <div className="compareItem">{concert2?.rating || "-"}</div>
                        <div className="compareItem">${concert2?.price || "-"}</div>
                        <div className="compareItem">Set List</div>
                        <div className="compareItem">Quoted Vibes</div>
                        <div className="compareItem">{concert2?.city || "-"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareModule;
