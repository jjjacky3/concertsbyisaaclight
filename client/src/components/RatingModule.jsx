/**
 * 
 * This component renders a visual representation of concert ratings distribution with
 * horizontally animated bar charts.
 * 
 * It also includes:
 * - A prominent header with star icon emphasizing the ratings context
 * - Five horizontal bar graphs representing rating counts from 5 to 1
 * - Dynamically calculated bar widths proportional to the highest rating count
 * - Clear labeling of each rating score with its corresponding review count
 * - Error handling for missing or invalid ratings data
 * 
 * The component automatically normalizes bar lengths based on the maximum rating count,
 * providing visual clarity even with widely varying review numbers. It features smooth
 * animations for hover interactions, error messages for data integrity issues, and
 * maintains consistent spacing and alignment across all rating bars for improved readability.
 */

import { Star } from "lucide-react";

const RatingModule = ({ ratings, onDropConcert }) => {
    if (!ratings) {
        console.error("Received undefined ratings in RatingModule");
        return <div className="text-red-500">Error: Ratings data is missing</div>;
    }

    console.log("Ratings Input for module is:", ratings);

    let maxValue = Math.max(...Object.values(ratings));

    // Compute normalized bar widths for each rating (1-5)
    const ratingWidths = [5, 4, 3, 2, 1].map(rating => (ratings[rating] / maxValue) * 100);

    return (
        <div className="relative w-full max-w-[700px] bg-gray-700/70 text-white rounded-3xl shadow-2xl p-6 transition-transform transform hover:scale-[1.02] hover:shadow-[0px_10px_30px_rgba(0,0,0,0.3)] mx-auto">
            {/* Header with Star Icon */}
            <div className="text-3xl font-bold text-center flex items-center justify-center gap-2 pb-4">
                <Star className="w-6 h-6 text-yellow-500" />
                <span>Ratings</span>
            </div>

            {/* Rating Bars */}
            <div className="flex flex-col space-y-4 items-center">
                {[5, 4, 3, 2, 1].map((rating, index) => (
                    <div key={rating} className="flex items-center justify-between w-full">
                        {/* Rating Number */}
                        <div className="text-2xl font-bold w-6 text-right">{rating}</div>

                        {/* Progress Bar Container */}
                        <div className="flex-grow h-10 border-2 border-white rounded-lg flex items-center overflow-hidden mx-4">
                            {/* Filled Bar */}
                            <div
                                className="h-full bg-white rounded-lg transition-all duration-300"
                                style={{ width: `${ratingWidths[index]}%` }}
                            ></div>
                        </div>

                        {/* Review Count - Always in One Line */}
                        <div className="text-sm font-bold w-20 text-left whitespace-nowrap">
                            {ratings[rating]} reviews
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RatingModule;
