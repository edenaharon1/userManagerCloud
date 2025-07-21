locals {
  vpc_name        = "final-cloud-rds"
  vpc_cidr_block  = "20.10.0.0/16"
  public_subnets  = ["20.10.0.0/20", "20.10.16.0/20", "20.10.32.0/20"]

  common_tags = {
    project = "final-cloud-rds-vpc"
  }

  ec2_key_name    = "clouds-kp"
  app_ami         = "ami-05b1efdb91a08fb09"
  instance_type   = "t2.micro"
}
