package javaDemo;

public class DataTypeDemo {
	public static void main(String[] args) {
		
		int count;
		double sum, temp, result;
		char b;
		
		// declaration, initialization and assignment
		count = 1;          // Assign 1 to total;
		sum = 2.0;   		// Assign 2.0 to sum;
		b = 'B';        	// Assign 'B' to b;
		
		count = 5;
		System.out.println("count: " + count); // variable count is converted to a String before concatenation
		System.out.println("b: " + b);
		System.out.println();
		
		double total = 10.4;
		int key = 18, base = 2;
		
		/*
		// constant variables
		final int NUM_QUARTERS_IN_YEAR = 4;
		final double PI = 3.14159;
		
		// division and remainder
		System.out.println("19/5: " + 19/5);
		System.out.println("19%5: " + 19%5);
		System.out.println("19.0/5: " + 19.0/5);
		System.out.println("19.0%5: " + 19.0%5);
		System.out.println();
		
		// calculations with floating-point numbers
		System.out.println("1.0-0.9: " + (1.0-0.9)); // print 0.09999999999999998; floating-point numbers are not stored with complete accuracy
		System.out.println();
		
		// Assignment conversion
		int age = 25;
		double preciseAge = age;
		System.out.println("age is " + age); // the value and type of age did NOT change
		System.out.println("preciseAge is " +preciseAge); // preciseAge contains the value 25.0
		System.out.println();
		
		// Promotion
		int items = 8; 
		double totalCost = 199.99;
		double averageCost = totalCost / items; // the value of items is converted to double, i.e., 8.0
		System.out.println(items); // the value of items is NOT changed
		System.out.println(averageCost); 
		System.out.println();
		
		// Reassignment may fail after promotion
		short small_num = 10;
		small_num ++; // allowed
		System.out.println("Incremented small_num is " + small_num);
		small_num += 2; // allowed
		System.out.println("Updated small_num is " + small_num);
		// small_num = small_num + 3; // the math is valid, but we can't store the result (int) back into a short type variable
		System.out.println();
		
		// Narrowing casting
		preciseAge = 25.8; // preciseAge is of double type
		int integerAge = (int) preciseAge; 
		age = (int) preciseAge; 
		System.out.println("Updated preciseAge is " + preciseAge); // the value in preciseAge is not changed
		System.out.println("integerAge is "+ integerAge); // narrowing conversion; the fractional part is truncated
		System.out.println("Age with casting is " + age); // fractional part is truncated
		System.out.println();
		
		// Widening casting
		int score = 75;
		double averageScore = (double) score / 4;
		System.out.println("Average score is " + averageScore);
		// Without casting
		averageScore = score / 4;
		System.out.println("Average score calculated without casting is " + averageScore); // averageScore is 18.0, not 18
		System.out.println();
		
		// Casting in an augmented expression
		count = 38; // count is of int type
		count += 2.8; // allowed, equivalent to count = (int)(count + 2.8)
		System.out.println("Updated count is " + count); // count becomes 40 
		*/
	}
}