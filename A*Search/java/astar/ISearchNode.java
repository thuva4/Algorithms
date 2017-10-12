package astar;
import java.util.*;

/**
 * Interface of a search node.
 */
public interface ISearchNode {
    // total estimated cost of the node
    public double f();
    //"tentative" g, cost from the start node 
    public double g();
    //set "tentative" g
    public void setG(double g);
    //heuristic cost to the goal node
    public double h();
    //costs to a successor
    public double c(ISearchNode successor);
    // a node possesses or computes his successors
    public ArrayList<ISearchNode> getSuccessors();
    // get parent of node in a path
    public ISearchNode getParent();
    //set parent
    public void setParent(ISearchNode parent);
    //unique hash for a node to be used in a hash map
    //makes algorithm significantly faster
    //return null if you do not want this feature
    public Integer keyCode();
    
    public boolean equals(Object other);

    public int hashCode();
}

