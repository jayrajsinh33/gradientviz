import Types "../types/gradient-descent";
import GradLib "../lib/gradient-descent";
import List "mo:core/List";
import Runtime "mo:core/Runtime";

mixin (
  state : Types.SimulationState,
  lossHistory : List.List<Types.LossEntry>
) {
  /// Initialize the simulation with starting weights
  public func initialize(w1 : Float, w2 : Float) : async () {
    state.w1 := w1;
    state.w2 := w2;
    state.iteration := 0;
    state.initialized := true;
    state.initialW1 := w1;
    state.initialW2 := w2;
    lossHistory.clear();
    let initialLoss = GradLib.computeLoss(w1, w2);
    lossHistory.add({ iteration = 0; loss = initialLoss });
  };

  /// Perform one gradient descent step with the given learning rate.
  /// Returns the new weights, loss value, gradient magnitude, and iteration number.
  public func step(learningRate : Float) : async Types.StepResult {
    if (not state.initialized) {
      Runtime.trap("Simulation not initialized. Call initialize() first.");
    };
    let (grad1, grad2) = GradLib.computeGradient(state.w1, state.w2);
    let newW1 = state.w1 - learningRate * grad1;
    let newW2 = state.w2 - learningRate * grad2;
    let newIteration = state.iteration + 1;
    let loss = GradLib.computeLoss(newW1, newW2);
    let gradMag = GradLib.computeGradientMagnitude(grad1, grad2);

    state.w1 := newW1;
    state.w2 := newW2;
    state.iteration := newIteration;

    let entry : Types.LossEntry = { iteration = newIteration; loss = loss };
    lossHistory.add(entry);

    { w1 = newW1; w2 = newW2; loss = loss; gradientMagnitude = gradMag; iteration = newIteration };
  };

  /// Reset the simulation back to initial weights
  public func reset() : async () {
    if (not state.initialized) {
      Runtime.trap("Simulation not initialized. Call initialize() first.");
    };
    let w1 = state.initialW1;
    let w2 = state.initialW2;
    state.w1 := w1;
    state.w2 := w2;
    state.iteration := 0;
    lossHistory.clear();
    let initialLoss = GradLib.computeLoss(w1, w2);
    lossHistory.add({ iteration = 0; loss = initialLoss });
  };

  /// Return the full loss history as (iteration, loss) pairs
  public query func getLossHistory() : async [Types.LossEntry] {
    lossHistory.toArray();
  };

  /// Return sampled loss values over a 2D grid for visualization.
  /// The grid is centered around the optimal weights with a fixed range.
  public query func getLossSurface(gridSize : Nat) : async [Types.LossSurfacePoint] {
    GradLib.buildLossSurface(gridSize, GradLib.OPTIMAL_W1, GradLib.OPTIMAL_W2, 5.0);
  };
};
