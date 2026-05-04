package javaDemo;

public class HelloWorldDemo {
	/* this is a multiline comment
	 
	 */
	public static  void main(String[] args) {
		System.out.print("Hello World!"); 
		System.out.println("Next line please!");
		System.out.print("Zero-th argument: " + args[0]);
		System.out.println("First argument: " + args[1]);
		System.out.println(1/0);
	}
}
