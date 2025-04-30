/**
 * Calculates the quantity of fertilizer or application based on the lot area
 * @param {number} baseQuantity - The base quantity per hectare
 * @param {number} lotSize - The lot size in hectares
 * @returns {number} - The calculated quantity for the specific lot size
 */
export const calculateAreaBasedQuantity = (baseQuantity, lotSize) => {
  return baseQuantity * lotSize;
};

/**
 * Processes a single fertilizer object to scale its quantity based on lot size
 * @param {Object} fertilizer - The fertilizer object
 * @param {number} lotSize - The lot size in hectares
 * @returns {Object} - The processed fertilizer with scaled quantity
 */
const processFertilizer = (fertilizer, lotSize) => {
  if (!fertilizer) return null;

  return {
    ...fertilizer,
    quantity: calculateAreaBasedQuantity(fertilizer.quantity, lotSize),
  };
};

/**
 * Processes recommendation data to scale quantities based on lot size
 * @param {Object} recommendation - The original recommendation data
 * @param {number} lotSize - The lot size in hectares
 * @returns {Object} - The processed recommendation with scaled quantities
 */
export const processRecommendationForArea = (recommendation, lotSize) => {
  console.log("Processing recommendation for lot size:", lotSize);
  if (!recommendation) {
    console.log("No recommendation provided.");
    return null;
  }

  // Create a deep copy of the recommendation to avoid modifying the original
  const processedRecommendation = JSON.parse(JSON.stringify(recommendation));
  console.log(
    "Original recommendation:",
    JSON.parse(JSON.stringify(recommendation))
  );

  // Process primary fertilizer if it exists
  if (processedRecommendation.primary_fertilizer) {
    console.log(
      "Primary fertilizer quantity BEFORE processing:",
      processedRecommendation.primary_fertilizer.quantity
    );
    const processedPrimary = processFertilizer(
      processedRecommendation.primary_fertilizer,
      lotSize
    );
    console.log(
      "Primary fertilizer quantity AFTER processing:",
      processedPrimary ? processedPrimary.quantity : "N/A"
    );
    processedRecommendation.primary_fertilizer = processedPrimary;
  }

  // Process secondary fertilizer if it exists
  if (processedRecommendation.secondary_fertilizer) {
    // Optional: Add similar logging for secondary if needed
    processedRecommendation.secondary_fertilizer = processFertilizer(
      processedRecommendation.secondary_fertilizer,
      lotSize
    );
  }

  // Process fertilizer list if it exists
  if (processedRecommendation.fertilizers) {
    // Optional: Add logging within the map if needed
    processedRecommendation.fertilizers =
      processedRecommendation.fertilizers.map((fertilizer) =>
        processFertilizer(fertilizer, lotSize)
      );
  }

  // Process application quantities if they exist
  if (processedRecommendation.applications) {
    // Optional: Add logging within the map if needed
    processedRecommendation.applications =
      processedRecommendation.applications.map((application) => ({
        ...application,
        quantity: calculateAreaBasedQuantity(application.quantity, lotSize),
      }));
  }

  console.log("Final processed recommendation:", processedRecommendation);
  return processedRecommendation;
};
