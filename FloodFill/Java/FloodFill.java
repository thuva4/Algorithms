import java.awt.Color;
import java.awt.Graphics;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

import javax.swing.JFrame;

public class FloodFill extends JFrame{
	private int myPixel = 25;
	private int loops = 1;
	
	public FloodFill() {
		KeyListener listener = new MyKeyListener();
		addKeyListener(listener);
		setFocusable(true);
	}

	
	private void drawGrid(Graphics g){
		g.setColor(Color.white);
		for(int i=0; i < 500; i+=myPixel){
			g.drawLine(0, i, 500, i);
			g.drawLine(i, 0, i, 500);
		}
	}

	private Color[][] fill(int x, int y, int loops){
		Color[][] toFill = new Color[20][20];
		toFill = floodFill(x, y, toFill, loops);

		return toFill;
	}

	private Color[][] floodFill(int x, int y, Color[][] toFill, int loops){
		if(loops <= 0){
			return toFill;
		}
		if(x < 3 || x >= 17 || y < 3 || y >= 17){
			return toFill;
		}
		if(toFill[x][y] != null && (!toFill[x][y].equals(Color.red))){
			return toFill;
		}
		else{
			toFill[x][y] = Color.red;
			toFill = floodFill(x+1, y, toFill, loops-1);
			toFill = floodFill(x, y+1, toFill, loops-1);
			toFill = floodFill(x-1, y, toFill, loops-1);
			toFill = floodFill(x, y-1, toFill, loops-1);
		}
		return toFill;
	}

	private void drawFill(Graphics g, Color[][] toFill){
		for(int i=0; i < toFill.length; i++){
			for(int j=0; j< toFill[i].length; j++){
				g.setColor(toFill[i][j]);
				g.fillRect(i*myPixel, j*myPixel, myPixel, myPixel);
				g.setColor(Color.black);
			}
		}
	}

	public void paint(Graphics g){
		Color[][] toFill = fill(10,10,loops);
		drawFill(g, toFill);
		drawGrid(g);
		repaint();
	}
	
	public static void main(String[] args){
		FloodFill frame = new FloodFill();
		frame.setTitle("Flood Fill");
		frame.setSize(500,500);
		frame.setVisible(true);
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
	}
	public class MyKeyListener implements KeyListener{
		@Override
		public void keyPressed(KeyEvent arg0) {
		}

		@Override
		public void keyReleased(KeyEvent arg0) {
			if(arg0.getKeyCode() == 39){
				loops++;
			}
			if(arg0.getKeyCode() == 37){
				loops--;
			}
			System.out.println(loops);
		}

		@Override
		public void keyTyped(KeyEvent arg0) {
			// TODO Auto-generated method stub

		}
	}
}