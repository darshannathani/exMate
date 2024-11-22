USE [PreInternship]
GO
/****** Object:  Table [dbo].[Candidate]    Script Date: 01-11-2024 10:29:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Candidate](
	[c_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](15) NOT NULL,
	[college] [varchar](50) NOT NULL,
	[email] [varchar](max) NOT NULL,
	[phone] [varchar](10) NOT NULL,
	[birthdate] [datetime2](7) NOT NULL,
	[password] [varchar](max) NOT NULL,
 CONSTRAINT [PK_candidate] PRIMARY KEY CLUSTERED 
(
	[c_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Admin]    Script Date: 01-11-2024 10:29:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Admin](
	[a_id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](15) NOT NULL,
	[email] [varchar](max) NOT NULL,
	[phone] [varchar](10) NOT NULL,
	[password] [varchar](max) NOT NULL,
 CONSTRAINT [PK_admin] PRIMARY KEY CLUSTERED 
(
	[a_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Candidate] ON 
GO
INSERT [dbo].[Candidate] ([c_id], [name], [college], [email], [phone], [birthdate], [password]) VALUES (1, N'a', N'bvm', N'a@a.com', N'7600002682', CAST(N'2002-08-26T00:00:00.0000000' AS DateTime2), N'$2a$10$AGHDeWobNuoJ9tCGAISMp.QA3TmIWiwegf35EhsIV5jsxXsaH7Iwm')
GO
INSERT [dbo].[Candidate] ([c_id], [name], [college], [email], [phone], [birthdate], [password]) VALUES (2, N'b', N'DDU', N'b@b.com', N'9723026802', CAST(N'2003-01-25T00:00:00.0000000' AS DateTime2), N'$2a$10$RdGP.KbyoYxhPw0w502rIeUmGlUlHFOeo1SVej8CwyDB9J.LpbNCW')
GO
SET IDENTITY_INSERT [dbo].[Candidate] OFF
GO
SET IDENTITY_INSERT [dbo].[Admin] ON 
GO
INSERT [dbo].[Admin] ([a_id], [name], [email], [phone], [password]) VALUES (1, N'super', N'super@admin.com', N'1234567890', N'$2a$10$BVJP1X82GUyMi1DVBGc7BOts36gtpA3tAnPhKSugTwu02HN78ELyW')
GO
SET IDENTITY_INSERT [dbo].[Admin] OFF
GO
