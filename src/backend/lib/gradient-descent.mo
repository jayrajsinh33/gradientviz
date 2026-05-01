import Types "../types/gradient-descent";
import List "mo:core/List";
import Float "mo:core/Float";
import Array "mo:core/Array";

module {
  /// Optimal weights for the quadratic loss function L(w1,w2) = (w1-a)^2 + (w2-b)^2
  public let OPTIMAL_W1 : Float = 3.0;
  public let OPTIMAL_W2 : Float = 2.0;

  /// Compute the loss value at given weights: L(w1, w2) = (w1-3)^2 + (w2-2)^2
  public func computeLoss(w1 : Float, w2 : Float) : Float {
    let d1 = w1 - OPTIMAL_W1;
    let d2 = w2 - OPTIMAL_W2;
    d1 * d1 + d2 * d2;
  };

  /// Compute the gradient at given weights: (dL/dw1, dL/dw2) = (2*(w1-3), 2*(w2-2))
  public func computeGradient(w1 : Float, w2 : Float) : (Float, Float) {
    (2.0 * (w1 - OPTIMAL_W1), 2.0 * (w2 - OPTIMAL_W2));
  };

  /// Compute gradient magnitude (Euclidean norm of gradient vector)
  public func computeGradientMagnitude(grad1 : Float, grad2 : Float) : Float {
    Float.sqrt(grad1 * grad1 + grad2 * grad2);
  };

  /// Build a 2D grid of loss surface samples centered around (centerW1, centerW2)
  public func buildLossSurface(
    gridSize : Nat,
    centerW1 : Float,
    centerW2 : Float,
    halfRange : Float
  ) : [Types.LossSurfacePoint] {
    if (gridSize == 0) return [];
    let n = gridSize;
    let step = if (n <= 1) 0.0 else (2.0 * halfRange) / (n - 1).toFloat();
    let startW1 = centerW1 - halfRange;
    let startW2 = centerW2 - halfRange;

    Array.tabulate<Types.LossSurfacePoint>(
      n * n,
      func(idx) {
        let i = idx / n;
        let j = idx % n;
        let w1 = startW1 + i.toFloat() * step;
        let w2 = startW2 + j.toFloat() * step;
        { w1 = w1; w2 = w2; loss = computeLoss(w1, w2) };
      }
    );
  };
};
