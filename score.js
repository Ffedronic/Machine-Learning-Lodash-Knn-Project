const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

/**
 * The function `runAnalysis` splits a dataset into a test set and a training set, and then iterates
 * over a range of values for k to calculate the accuracy of a k-nearest neighbors algorithm on the
 * test set.
 */
function runAnalysis() {
  const testSetSize = 50;
  const k = 10;

  _.range(0, 3).forEach((feature) => {
    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    const [testSet, trainingSet] = splitDataSet(minMax(data, 1), testSetSize);
    const accurency = _.chain(testSet)
      .filter((testPoint) => {
        return knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint);
      })
      .size()
      .divide(testSetSize)
      .value();

    console.log("for feature of ",feature, "accurency is ", accurency);
  });
}

/**
 * The function `knn` is a JavaScript implementation of the k-nearest neighbors algorithm, which takes
 * in a dataset, a point, and a value of k, and returns the most common label among the k nearest
 * neighbors to the given point.
 * @param data - The `data` parameter is an array of arrays. Each inner array represents a data point
 * and contains three values. The first two values represent the coordinates of the data point, and the
 * last value represents the label or class of the data point.
 * @param point - The "point" parameter is a data point that you want to classify using the k-nearest
 * neighbors algorithm. It is an array with 3 values.
 * @param k - The parameter "k" represents the number of nearest neighbors to consider in the k-nearest
 * neighbors algorithm.
 * @returns the predicted class label for the given point using the k-nearest neighbors algorithm.
 */
function knn(data, point, k) {
  // point has 3 values
  return _.chain(data)
    .map((row) => {
      return [distance(_.initial(row), point), _.last(row)];
    })
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

/**
 * The distance function calculates the Euclidean distance between two points in a multi-dimensional
 * space.
 * @param pointA - The `pointA` parameter represents the coordinates of a point in n-dimensional space.
 * It can be an array or any iterable object containing numerical values.
 * @param pointB - The parameter `pointB` represents the coordinates of a point in a multi-dimensional
 * space. It is an array that contains the values for each dimension of the point.
 * @returns the Euclidean distance between two points, pointA and pointB.
 */
function distance(pointA, pointB) {
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

/**
 * The function splits a given dataset into a test set and a training set.
 * @param data - The `data` parameter is an array that represents the dataset that needs to be split
 * into a test set and a training set.
 * @param testCount - The `testCount` parameter is the number of data points that you want to include
 * in the test set. The remaining data points will be included in the training set.
 * @returns an array containing two elements: the test set and the training set.
 */
function splitDataSet(data, testCount) {
  const shuffled = _.shuffle(data);

  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  const cloneData = _.cloneDeep(data);

  for (let i = 0; i < featureCount; i++) {
    const column = cloneData.map((row) => row[i]);
    const min = _.min(column);
    const max = _.max(column);

    for (let j = 0; j < cloneData.length; j++) {
      cloneData[j][i] = (cloneData[j][i] - min) / (max - min);
    }
  }

  return cloneData;
}
