data "aws_iam_policy" "required-policy" {
  name = "AmazonSSMFullAccess"
}

# Create the IAM role
resource "aws_iam_role" "ec2-role" {
  name = "ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Sid    = ""
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Attach the policy to the role
resource "aws_iam_role_policy_attachment" "attach-s3" {
  role       = aws_iam_role.ec2-role.name
  policy_arn = data.aws_iam_policy.required-policy.arn
}

# Create the instance profile
resource "aws_iam_instance_profile" "ec2-role" {
  name = "ec2-role"
  role = aws_iam_role.ec2-role.name
}
