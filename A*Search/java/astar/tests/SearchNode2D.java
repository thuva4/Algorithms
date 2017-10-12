package astar.tests;
import java.util.*;

import astar.ASearchNode;
import astar.ISearchNode;

public class SearchNode2D extends ASearchNode {
    private int x;
    private int y;
    private SearchNode2D parent;
    private GoalNode2D goal;

    public SearchNode2D(int x, int y, SearchNode2D parent, GoalNode2D goal){
        this.x = x;
        this.y = y;
        this.parent = parent;
        this.goal = goal;

    }    
    public SearchNode2D getParent(){
        return this.parent;
    }
    public ArrayList<ISearchNode> getSuccessors() {
        ArrayList<ISearchNode> successors = new ArrayList<ISearchNode>();
        successors.add(new SearchNode2D(this.x-1, this.y, this, this.goal));
        successors.add(new SearchNode2D(this.x+1, this.y, this, this.goal));
        successors.add(new SearchNode2D(this.x, this.y+1, this, this.goal));
        successors.add(new SearchNode2D(this.x, this.y-1, this, this.goal));
        return successors; 
    }
    public double h() {
        return this.dist(goal.getX(), goal.getY());
    }
    public double c(ISearchNode successor) {
        SearchNode2D successorNode = this.castToSearchNode2D(successor);
        return 1;
    }
    public void setParent(ISearchNode parent) {
        this.parent = this.castToSearchNode2D(parent);
    }
    public boolean equals(Object other) {
        if(other instanceof SearchNode2D) {
            SearchNode2D otherNode = (SearchNode2D) other;
            return (this.x == otherNode.getX()) && (this.y == otherNode.getY());
        }
        return false;
    }
 
    public int hashCode() {
        return (41 * (41 + this.x + this.y));
    }
    public double dist(int otherX, int otherY) {
        return Math.sqrt(Math.pow(this.x-otherX,2) + Math.pow(this.y-otherY,2));
    }
    public int getX() {
        return this.x;
    }
    public int getY() {
        return this.y;
    }
    public String toString(){
        return "(" + Integer.toString(this.x) + ";" + Integer.toString(this.y) 
                + ";h:"+ Double.toString(this.h()) 
                + ";g:" +  Double.toString(this.g()) + ")";
    }

    private SearchNode2D castToSearchNode2D(ISearchNode other) {
        return (SearchNode2D) other;
    }

    public Integer keyCode() {
    	return null;
    }
}
