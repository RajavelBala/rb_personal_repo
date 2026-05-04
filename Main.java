package com.openai.example;

import com.openai.client.OpenAIClient;
import com.openai.client.okhttp.OpenAIOkHttpClient;
import com.openai.models.responses.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;


public class Main {
	// helper method to print AI response
		  public static String extractOutputText(Response response) {
			    return response.output().stream()
			        .flatMap(item -> item.message().stream())          // Optional<ResponseOutputMessage>
			        .flatMap(message -> message.content().stream())    // Optional<List<Content>>
			        .flatMap(content -> content.outputText().stream()) // Optional<ResponseOutputText>
			        .map(outputText -> outputText.text())              // the actual string
			        .collect(Collectors.joining());
			  }
		
	   
		  public static void main(String[] args) {

	        OpenAIClient client = OpenAIOkHttpClient.fromEnv();

	        ResponseCreateParams params = ResponseCreateParams.builder()
	                .model("gpt-4.1-mini")
	                .input("Explain Java in simple terms.")
	                .build();

	        Response response = client.responses().create(params);
	       // System.out.println(response.output());
	        System.out.println(extractOutputText(response));
	        
	        List<ResponseInputItem> inputItems = Arrays.asList(
	        	    ResponseInputItem.ofEasyInputMessage(
	        	        EasyInputMessage.builder()
	        	            .role(EasyInputMessage.Role.DEVELOPER)
	        	            .content("Assess the message's sentiment. Only respond with one of the following labels: positive, neutral, negative")
	        	            .build()
	        	    ),
	        	    ResponseInputItem.ofEasyInputMessage(
	        	        EasyInputMessage.builder()
	        	            .role(EasyInputMessage.Role.USER)
	        	            .content("Today is a great day!")
	        	            .build()
	        	    )
	        	);

	        params = ResponseCreateParams.builder()
	            .model("gpt-4.1-mini")
	            .input(ResponseCreateParams.Input.ofResponse(inputItems))
	            .build();
	        
	        response = client.responses().create(params);
	        //System.out.println(response.output());
	        System.out.println(extractOutputText(response));
		  }

}
