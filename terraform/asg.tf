resource "aws_launch_template" "asg-launch-template" {
  name          = "web_servers_lt"
  image_id      = local.app_ami
  key_name      = local.ec2_key_name
  instance_type = local.instance_type
  vpc_security_group_ids = [aws_security_group.web_servers.id, aws_security_group.internal.id ]
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "web-servers"
    }
  }
  iam_instance_profile {
    name = "ec2-role"
  }
  user_data = filebase64("${path.module}/app-start.sh")
}

resource "aws_autoscaling_group" "asg" {
  name = "colman-asg"
  launch_template {
    id      = aws_launch_template.asg-launch-template.id
    version = aws_launch_template.asg-launch-template.latest_version
  }
  vpc_zone_identifier = module.vpc.public_subnets
  min_size            = 2
  max_size            = 2
  desired_capacity    = 2
  health_check_type   = "ELB"

  tag {
    key                 = "Name"
    value               = "asg-instance"
    propagate_at_launch = true
  }
}
