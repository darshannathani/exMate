USE [PreInternship]
GO
/****** Object:  Table [dbo].[admin]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[admin](
	[a_id] [int] IDENTITY(1,1) NOT NULL,
	[email] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[password] [varchar](255) NULL,
	[phone] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[a_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[candidate]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[candidate](
	[c_id] [int] IDENTITY(1,1) NOT NULL,
	[birthdate] [date] NULL,
	[college] [varchar](255) NULL,
	[email] [varchar](255) NULL,
	[name] [varchar](255) NULL,
	[password] [varchar](255) NULL,
	[phone] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[c_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[exam]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exam](
	[exam_id] [int] IDENTITY(1,1) NOT NULL,
	[total_marks] [int] NOT NULL,
	[description] [varchar](255) NULL,
	[difficulty] [varchar](255) NULL,
	[duration] [int] NOT NULL,
	[end_date] [datetime2](6) NULL,
	[passing_score] [int] NOT NULL,
	[programming] [int] NOT NULL,
	[start_date] [datetime2](6) NULL,
	[status] [varchar](255) NULL,
	[title] [varchar](255) NULL,
	[logical] [int] NOT NULL,
	[technical] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[exam_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[exam_log]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exam_log](
	[exam_log_id] [int] IDENTITY(1,1) NOT NULL,
	[exam_flag] [int] NOT NULL,
	[timestamp] [datetime2](6) NULL,
	[candidate_id] [int] NULL,
	[exam_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[exam_log_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[exam_question_mapping]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exam_question_mapping](
	[map_id] [int] IDENTITY(1,1) NOT NULL,
	[ex_id] [int] NULL,
	[ques_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[map_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[exam_result]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[exam_result](
	[result_id] [int] IDENTITY(1,1) NOT NULL,
	[date_completed] [datetime2](6) NULL,
	[score] [int] NOT NULL,
	[status] [varchar](255) NULL,
	[candidate_id] [int] NULL,
	[exam_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[result_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[mcq_option]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[mcq_option](
	[option_id] [int] IDENTITY(1,1) NOT NULL,
	[image] [varchar](255) NULL,
	[is_correct] [varchar](255) NULL,
	[option_text] [varchar](255) NULL,
	[question_id] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[option_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[question_bank]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[question_bank](
	[question_id] [int] IDENTITY(1,1) NOT NULL,
	[difficulty] [varchar](255) NULL,
	[image] [varchar](255) NULL,
	[marks] [int] NOT NULL,
	[section_type] [varchar](255) NULL,
	[text] [varchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[question_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[response]    Script Date: 25-12-2024 09:25:35 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[response](
	[response_id] [int] IDENTITY(1,1) NOT NULL,
	[is_correct] [varchar](255) NULL,
	[programming_response] [varchar](255) NULL,
	[timestamp] [datetime2](6) NULL,
	[candidate_id] [int] NULL,
	[exam_id] [int] NULL,
	[option_id] [int] NULL,
	[question_id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[response_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[exam_log]  WITH CHECK ADD  CONSTRAINT [FK5dt8emgc69357dhf6psgxbrmv] FOREIGN KEY([exam_id])
REFERENCES [dbo].[exam] ([exam_id])
GO
ALTER TABLE [dbo].[exam_log] CHECK CONSTRAINT [FK5dt8emgc69357dhf6psgxbrmv]
GO
ALTER TABLE [dbo].[exam_log]  WITH CHECK ADD  CONSTRAINT [FK9k424huw33nhfsqnxy37gae9d] FOREIGN KEY([candidate_id])
REFERENCES [dbo].[candidate] ([c_id])
GO
ALTER TABLE [dbo].[exam_log] CHECK CONSTRAINT [FK9k424huw33nhfsqnxy37gae9d]
GO
ALTER TABLE [dbo].[exam_question_mapping]  WITH CHECK ADD  CONSTRAINT [FK86a56ng6jmf2gfosgar16ug38] FOREIGN KEY([ques_id])
REFERENCES [dbo].[question_bank] ([question_id])
GO
ALTER TABLE [dbo].[exam_question_mapping] CHECK CONSTRAINT [FK86a56ng6jmf2gfosgar16ug38]
GO
ALTER TABLE [dbo].[exam_question_mapping]  WITH CHECK ADD  CONSTRAINT [FKsrr2xd1ffdblrgxakolsjfmjl] FOREIGN KEY([ex_id])
REFERENCES [dbo].[exam] ([exam_id])
GO
ALTER TABLE [dbo].[exam_question_mapping] CHECK CONSTRAINT [FKsrr2xd1ffdblrgxakolsjfmjl]
GO
ALTER TABLE [dbo].[exam_result]  WITH CHECK ADD  CONSTRAINT [FKmblvyjlk9x7rrm7mvqtbedycc] FOREIGN KEY([exam_id])
REFERENCES [dbo].[exam] ([exam_id])
GO
ALTER TABLE [dbo].[exam_result] CHECK CONSTRAINT [FKmblvyjlk9x7rrm7mvqtbedycc]
GO
ALTER TABLE [dbo].[exam_result]  WITH CHECK ADD  CONSTRAINT [FKqjmv07rjwvya9he3qafboi4lm] FOREIGN KEY([candidate_id])
REFERENCES [dbo].[candidate] ([c_id])
GO
ALTER TABLE [dbo].[exam_result] CHECK CONSTRAINT [FKqjmv07rjwvya9he3qafboi4lm]
GO
ALTER TABLE [dbo].[mcq_option]  WITH CHECK ADD  CONSTRAINT [FKknlexxoiki5psvtrvg4s67g3s] FOREIGN KEY([question_id])
REFERENCES [dbo].[question_bank] ([question_id])
GO
ALTER TABLE [dbo].[mcq_option] CHECK CONSTRAINT [FKknlexxoiki5psvtrvg4s67g3s]
GO
ALTER TABLE [dbo].[response]  WITH CHECK ADD  CONSTRAINT [FK3emcyjklboljo2w4relkv1opa] FOREIGN KEY([question_id])
REFERENCES [dbo].[question_bank] ([question_id])
GO
ALTER TABLE [dbo].[response] CHECK CONSTRAINT [FK3emcyjklboljo2w4relkv1opa]
GO
ALTER TABLE [dbo].[response]  WITH CHECK ADD  CONSTRAINT [FKeo9onlw4nsqe5ctqjksufrudg] FOREIGN KEY([exam_id])
REFERENCES [dbo].[exam] ([exam_id])
GO
ALTER TABLE [dbo].[response] CHECK CONSTRAINT [FKeo9onlw4nsqe5ctqjksufrudg]
GO
ALTER TABLE [dbo].[response]  WITH CHECK ADD  CONSTRAINT [FKlkibtce3939srdq9x2t8u8dwd] FOREIGN KEY([option_id])
REFERENCES [dbo].[mcq_option] ([option_id])
GO
ALTER TABLE [dbo].[response] CHECK CONSTRAINT [FKlkibtce3939srdq9x2t8u8dwd]
GO
ALTER TABLE [dbo].[response]  WITH CHECK ADD  CONSTRAINT [FKsn94c9qj4s43a2bv7c6w08n1q] FOREIGN KEY([candidate_id])
REFERENCES [dbo].[candidate] ([c_id])
GO
ALTER TABLE [dbo].[response] CHECK CONSTRAINT [FKsn94c9qj4s43a2bv7c6w08n1q]
GO
ALTER TABLE [dbo].[exam]  WITH CHECK ADD CHECK  (([difficulty]='Hard' OR [difficulty]='Medium' OR [difficulty]='Easy'))
GO
ALTER TABLE [dbo].[question_bank]  WITH CHECK ADD CHECK  (([difficulty]='Hard' OR [difficulty]='Medium' OR [difficulty]='Easy'))
GO
ALTER TABLE [dbo].[question_bank]  WITH CHECK ADD CHECK  (([section_type]='TECHNICAL' OR [section_type]='PROGRAMMING' OR [section_type]='LOGICAL'))
GO
