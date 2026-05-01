module {
  /// Represents the current state of the gradient descent optimizer
  public type SimulationState = {
    var w1 : Float;
    var w2 : Float;
    var iteration : Nat;
    var initialized : Bool;
    var initialW1 : Float;
    var initialW2 : Float;
  };

  /// Result returned after each gradient descent step
  public type StepResult = {
    w1 : Float;
    w2 : Float;
    loss : Float;
    gradientMagnitude : Float;
    iteration : Nat;
  };

  /// A single entry in the loss history
  public type LossEntry = {
    iteration : Nat;
    loss : Float;
  };

  /// A single cell in the 2D loss surface grid
  public type LossSurfacePoint = {
    w1 : Float;
    w2 : Float;
    loss : Float;
  };
};
