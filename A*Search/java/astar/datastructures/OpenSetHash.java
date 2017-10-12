package astar.datastructures;

import java.util.Comparator;

import astar.ISearchNode;

public class OpenSetHash implements IOpenSet {
	private HashPriorityQueue<Integer, ISearchNode> hashQ;
	private Comparator<ISearchNode> comp;

	public OpenSetHash(Comparator<ISearchNode> comp) {
		this.hashQ = new HashPriorityQueue<Integer, ISearchNode>(comp);
		this.comp = comp;
	}

	@Override
	public void add(ISearchNode node) {
		this.hashQ.add(node.keyCode(), node);
	}

	@Override
	public void remove(ISearchNode node) {
		this.hashQ.remove(node.keyCode(), node);
	}

	@Override
	public ISearchNode poll() {
		return this.hashQ.poll();
	}

	@Override
	public ISearchNode getNode(ISearchNode node) {
		return this.hashQ.get(node.keyCode());
	}

	@Override
	public int size() {
		return this.hashQ.size();
	}

	@Override
	public String toString() {
		return this.hashQ.getTreeMap().keySet().toString();
	}

}
