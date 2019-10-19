public class DiffieHellman {

    public static void main(String[] args) {
        int p = 11; // Prime number
        int g = 2; // Generator of p
        int a = 9; // Alice's private value
        int b = 4; // Bob's private value

        int pubA = (int) Math.pow(g, a) % p; // Alice's public key
        int pubB = (int) Math.pow(g, b) % p; // Bob's public key

        int priA = (int) Math.pow(pubB, a) % p; // Final key that Alice got
        int priB = (int) Math.pow(pubA, b) % p; // Final key that Bob got

        System.out.println("Alice's key :: " + priA + "and Bob's key :: " + priB);
    }
}
