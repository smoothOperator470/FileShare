package com.mydaytodo.sfa.asset.config;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.client.builder.AwsClientBuilder.EndpointConfiguration;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDBClientBuilder;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.socialsignin.spring.data.dynamodb.repository.config.EnableDynamoDBRepositories;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "aws")
@EnableDynamoDBRepositories(basePackages = "com.mydaytodo.sfa.asset.repository")
@Getter
@Setter
@NoArgsConstructor
@Slf4j
public class AWSConfig {

    private String region;
    private String key;
    private String secret;
    private String s3UploadBucketName;

    @Value("${aws.dynamo-db.amazonDBEndpoint}")
    private String amazonDBEndpoint;

    @Value("${aws.upload-limit}")
    private Integer uploadLimit;

    @Bean
    public AWSCredentials amazonAwsCredentials() {
        return new BasicAWSCredentials(key, secret);
    }

    @Bean
    public AmazonDynamoDB amazonDynamoDB() {
        log.info("Initializing Amazon DynamoDB client...");

        return AmazonDynamoDBClientBuilder.standard()
                .withEndpointConfiguration(
                        new EndpointConfiguration(
                                "https://" + amazonDBEndpoint,
                                region))
                .withCredentials(
                        new AWSStaticCredentialsProvider(
                                amazonAwsCredentials()))
                .build();
    }

    @Bean
    public AmazonS3 amazonS3() {
        log.info("Initializing Amazon S3 client...");

        return AmazonS3ClientBuilder.standard()
                .withRegion(Regions.fromName(region))
                .withCredentials(
                        new AWSStaticCredentialsProvider(
                                amazonAwsCredentials()))
                .build();
    }

    public AmazonS3 s3Client() {
        return amazonS3();
    }
}