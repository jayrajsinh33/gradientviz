import Types "types/gradient-descent";
import GradientDescentApi "mixins/gradient-descent-api";
import List "mo:core/List";

actor {
  let state : Types.SimulationState = {
    var w1 = 0.0;
    var w2 = 0.0;
    var iteration = 0;
    var initialized = false;
    var initialW1 = 0.0;
    var initialW2 = 0.0;
  };
  let lossHistory = List.empty<Types.LossEntry>();

  include GradientDescentApi(state, lossHistory);
};
