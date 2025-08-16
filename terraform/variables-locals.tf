locals {
  vpc_name        = "colman-final-project"
  vpc_cidr_block  = "20.10.0.0/16"
  public_subnets  = ["20.10.0.0/20", "20.10.16.0/20", "20.10.32.0/20"]
  common_tags = {
    project = "colman"
  }

  ec2_key_name    = "cloud-korin"
  app_ami         = "ami-0197c5299d04daa75"
  instance_type   = "t2.micro"
}
